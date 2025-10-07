import { NextRequest, NextResponse } from 'next/server';
import { parseBody } from 'next-sanity/webhook';
import { publicClient } from '@/lib/sanity.client';
import { VercelVectorStore } from '@/lib/vector/vercel-vector-store';

// Webhookシークレットの検証
const secret = process.env.SANITY_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  try {
    console.log('[Sync DB] Webhook received');

    // Webhookシークレットの検証
    const signature = request.headers.get('sanity-webhook-signature');
    if (!signature || !secret) {
      console.log('[Sync DB] Missing signature or secret');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await parseBody(request, secret);
    if (!body) {
      console.log('[Sync DB] Invalid signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    const { _type, _id, _rev } = body as any;
    console.log(`[Sync DB] Document type: ${_type}, ID: ${_id}`);

    // 代表者更新の場合
    if (_type === 'representative') {
      console.log('[Sync DB] Representative update detected, syncing to database...');

      const representative = await publicClient.fetch(
        `*[_type == "representative" && _id == $id][0] {
          _id,
          _type,
          _updatedAt,
          name,
          englishName,
          birthName,
          title,
          location,
          biography,
          qualifications,
          services,
          achievements,
          philosophy,
          message,
          slug
        }`,
        { id: _id }
      );

      if (!representative) {
        console.log('[Sync DB] Representative not found');
        return NextResponse.json({ error: 'Representative not found' }, { status: 404 });
      }

      const vectorStore = new VercelVectorStore();
      await vectorStore.initialize();

      const qualificationsText = representative.qualifications?.join(', ') || '';
      const servicesText = representative.services?.join(', ') || '';

      const content = `
代表者: ${representative.name || 'Unknown'}
英語名: ${representative.englishName || ''}
役職: ${representative.title || ''}
所在地: ${representative.location || ''}
資格・認定: ${qualificationsText || ''}
提供サービス: ${servicesText || ''}
理念: ${representative.philosophy || ''}
メッセージ: ${representative.message || ''}

Cafe Kinesiの代表者は${representative.name}（${representative.englishName}）です。
${representative.title}として活動しています。
${representative.location ? `${representative.location}を拠点に活動しています。` : ''}
${representative.philosophy || ''}
`.trim();

      const document = {
        content,
        metadata: {
          id: representative._id,
          type: 'representative',
          name: representative.name,
          title: representative.title,
          location: representative.location,
          slug: representative.slug?.current || 'representative',
          updatedAt: representative._updatedAt
        },
        source: 'sanity-webhook-representative'
      };

      await vectorStore.addDocuments([document]);

      console.log(`[Sync DB] ✅ Representative ${representative.name} synced to database`);

      return NextResponse.json({
        success: true,
        type: _type,
        id: _id,
        name: representative.name,
        timestamp: new Date().toISOString()
      });
    }

    // インストラクター更新の場合
    if (_type === 'instructor') {
      console.log('[Sync DB] Instructor update detected, syncing to database...');

      // 更新されたインストラクターをSanityから取得
      const instructor = await publicClient.fetch(
        `*[_type == "instructor" && _id == $id][0] {
          _id,
          _type,
          _updatedAt,
          name,
          location,
          specialties,
          experience,
          description,
          slug,
          image,
          socialLinks,
          courses[]-> {
            _id,
            title
          }
        }`,
        { id: _id }
      );

      if (!instructor) {
        console.log('[Sync DB] Instructor not found');
        return NextResponse.json({ error: 'Instructor not found' }, { status: 404 });
      }

      // ベクトルストア初期化
      const vectorStore = new VercelVectorStore();
      await vectorStore.initialize();

      // ドキュメント作成
      const specialtiesText = instructor.specialties?.join(', ') || '';
      const coursesText = instructor.courses?.map((c: any) => c.title).join(', ') || '';

      const content = `
インストラクター: ${instructor.name || 'Unknown'}
専門分野: ${specialtiesText || '情報なし'}
経歴: ${instructor.experience || '情報なし'}
活動地域: ${instructor.location || '情報なし'}
担当コース: ${coursesText || '情報なし'}
紹介: ${instructor.description || ''}

このインストラクターは${instructor.location || ''}で活動しており、${specialtiesText}を専門としています。
${instructor.experience ? `${instructor.experience}の経験があります。` : ''}
${coursesText ? `${coursesText}などのコースを担当しています。` : ''}
`.trim();

      const document = {
        content,
        metadata: {
          id: instructor._id,
          type: 'instructor',
          name: instructor.name,
          location: instructor.location,
          specialties: instructor.specialties,
          slug: instructor.slug?.current || instructor.name?.toLowerCase().replace(/\s+/g, '-'),
          updatedAt: instructor._updatedAt
        },
        source: 'sanity-webhook-sync'
      };

      // データベースに追加/更新
      await vectorStore.addDocuments([document]);

      console.log(`[Sync DB] ✅ Instructor ${instructor.name} synced to database`);

      return NextResponse.json({
        success: true,
        type: _type,
        id: _id,
        name: instructor.name,
        timestamp: new Date().toISOString()
      });
    }

    // プロフィールページ（代表者情報）の更新
    if (_type === 'profilePage') {
      console.log('[Sync DB] ProfilePage update detected, syncing to database...');

      const profile = await publicClient.fetch(
        `*[_type == "profilePage"][0]`
      );

      if (!profile) {
        console.log('[Sync DB] ProfilePage not found');
        return NextResponse.json({ error: 'ProfilePage not found' }, { status: 404 });
      }

      const vectorStore = new VercelVectorStore();
      await vectorStore.initialize();

      // 活動内容をテキスト化
      const activitiesText = profile.activitiesItems?.map((item: any) => item.title).join(', ') || '';

      const content = `
代表者: ${profile.profileSection?.name || '星 ユカリ'}
読み: ${profile.profileSection?.nameReading || 'ヨシカワ ユカリ'}
所在地: ${profile.profileSection?.location || '長野県茅野市在住'}
現在の活動: ${activitiesText}

Cafe Kinesiの代表者は${profile.profileSection?.name || '星 ユカリ'}さんです。
${profile.profileSection?.location || '長野県茅野市'}を拠点に活動しています。
現在は、${profile.activitiesDescription || 'リトルトリーセミナーの主催、カフェキネシやピーチタッチの講師として活動しています。'}
${activitiesText ? `主な活動内容: ${activitiesText}` : ''}

カフェキネシの創業者として、誰もがセラピストになれる世界を目指し、
キネシオロジーとアロマを使った簡単で効果的なセラピーを広めています。
`.trim();

      const document = {
        content,
        metadata: {
          id: profile._id,
          type: 'profilePage',
          name: profile.profileSection?.name,
          location: profile.profileSection?.location,
          updatedAt: profile._updatedAt
        },
        source: 'sanity-profilePage'
      };

      await vectorStore.addDocuments([document]);

      console.log(`[Sync DB] ✅ ProfilePage synced to database`);

      return NextResponse.json({
        success: true,
        type: _type,
        name: profile.profileSection?.name,
        timestamp: new Date().toISOString()
      });
    }

    // その他のタイプの更新も必要に応じて処理
    if (['course', 'blogPost', 'page'].includes(_type)) {
      console.log(`[Sync DB] ${_type} update detected, syncing...`);

      // 該当するドキュメントを取得して同期
      const document = await publicClient.fetch(
        `*[_type == $type && _id == $id][0]`,
        { type: _type, id: _id }
      );

      if (document) {
        const vectorStore = new VercelVectorStore();
        await vectorStore.initialize();

        // ドキュメントの内容に応じてテキスト作成
        let content = '';
        const metadata: any = {
          id: document._id,
          type: document._type,
          updatedAt: document._updatedAt
        };

        switch (_type) {
          case 'course':
            content = `
コース名: ${document.title}
説明: ${document.description || ''}
料金: ${document.price || ''}
期間: ${document.duration || ''}
`.trim();
            metadata.title = document.title;
            break;

          case 'blogPost':
            content = `
タイトル: ${document.title}
内容: ${document.content || document.body || ''}
カテゴリ: ${document.category || ''}
`.trim();
            metadata.title = document.title;
            metadata.slug = document.slug?.current;
            break;

          default:
            content = JSON.stringify(document);
        }

        await vectorStore.addDocuments([{
          content,
          metadata,
          source: `sanity-webhook-${_type}`
        }]);

        console.log(`[Sync DB] ✅ ${_type} synced to database`);
      }
    }

    return NextResponse.json({
      success: true,
      type: _type,
      id: _id,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Sync DB] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// 手動同期エンドポイント（全データ）
export async function GET(request: NextRequest) {
  try {
    console.log('[Sync DB] Manual sync requested');

    const vectorStore = new VercelVectorStore();
    await vectorStore.initialize();

    // 1. プロフィールページ（代表者情報）を同期
    const profile = await publicClient.fetch(`*[_type == "profilePage"][0]`);
    if (profile) {
      const activitiesText = profile.activitiesItems?.map((item: any) => item.title).join(', ') || '';
      const profileDoc = {
        content: `
代表者: ${profile.profileSection?.name || '星 ユカリ'}
読み: ${profile.profileSection?.nameReading || 'ヨシカワ ユカリ'}
所在地: ${profile.profileSection?.location || '長野県茅野市在住'}
現在の活動: ${activitiesText}

Cafe Kinesiの代表者は${profile.profileSection?.name || '星 ユカリ'}さんです。
${profile.profileSection?.location || '長野県茅野市'}を拠点に活動しています。
現在は、${profile.activitiesDescription || 'リトルトリーセミナーの主催、カフェキネシやピーチタッチの講師として活動しています。'}
${activitiesText ? `主な活動内容: ${activitiesText}` : ''}

カフェキネシの創業者として、誰もがセラピストになれる世界を目指し、
キネシオロジーとアロマを使った簡単で効果的なセラピーを広めています。
`.trim(),
        metadata: {
          id: profile._id,
          type: 'profilePage',
          name: profile.profileSection?.name,
          location: profile.profileSection?.location,
          updatedAt: profile._updatedAt
        },
        source: 'manual-sync-profile'
      };
      await vectorStore.addDocuments([profileDoc]);
      console.log('[Sync DB] ✅ ProfilePage synced');
    }

    // 2. 全インストラクターを同期
    const instructors = await publicClient.fetch(`
      *[_type == "instructor"] {
        _id,
        _type,
        _updatedAt,
        name,
        location,
        specialties,
        experience,
        description,
        slug,
        image,
        socialLinks,
        courses[]-> {
          _id,
          title
        }
      }
    `);

    console.log(`[Sync DB] Found ${instructors.length} instructors`);

    // ドキュメント作成
    const documents = instructors.map((instructor: any) => {
      const specialtiesText = instructor.specialties?.join(', ') || '';
      const coursesText = instructor.courses?.map((c: any) => c.title).join(', ') || '';

      const content = `
インストラクター: ${instructor.name || 'Unknown'}
専門分野: ${specialtiesText || '情報なし'}
経歴: ${instructor.experience || '情報なし'}
活動地域: ${instructor.location || '情報なし'}
担当コース: ${coursesText || '情報なし'}
紹介: ${instructor.description || ''}

このインストラクターは${instructor.location || ''}で活動しており、${specialtiesText}を専門としています。
${instructor.experience ? `${instructor.experience}の経験があります。` : ''}
${coursesText ? `${coursesText}などのコースを担当しています。` : ''}
`.trim();

      return {
        content,
        metadata: {
          id: instructor._id,
          type: 'instructor',
          name: instructor.name,
          location: instructor.location,
          specialties: instructor.specialties,
          slug: instructor.slug?.current || instructor.name?.toLowerCase().replace(/\s+/g, '-'),
          updatedAt: instructor._updatedAt
        },
        source: 'manual-sync'
      };
    });

    // データベースに追加
    await vectorStore.addDocuments(documents);

    return NextResponse.json({
      success: true,
      profile: profile ? {
        name: profile.profileSection?.name,
        location: profile.profileSection?.location
      } : null,
      instructors: instructors.map((i: any) => ({
        name: i.name,
        location: i.location
      })),
      syncedCount: {
        profile: profile ? 1 : 0,
        instructors: instructors.length
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[Sync DB] Manual sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed' },
      { status: 500 }
    );
  }
}